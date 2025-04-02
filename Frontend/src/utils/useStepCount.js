import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const useFitnessData = () => {
  const [todaySteps, setTodaySteps] = useState(0);
  const [weeklySteps, setWeeklySteps] = useState(0);
  const [todayCalories, setTodayCalories] = useState(0);
  const [weeklyCalories, setWeeklyCalories] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;

    let isMounted = true;
    let script = null;
    let retryCount = 0;
    const maxRetries = 3;

    const loadGAPI = async () => {
      return new Promise((resolve, reject) => {
        if (window.gapi && window.gapi.client) {
          resolve();
          return;
        }

        if (document.querySelector('script[src="https://apis.google.com/js/api.js"]')) {
          const checkInterval = setInterval(() => {
            if (window.gapi && window.gapi.client) {
              clearInterval(checkInterval);
              resolve();
            }
          }, 100);
          return;
        }

        script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.async = true;
        script.defer = true;

        script.onload = () => {
          window.gapi.load('client:auth2', {
            callback: resolve,
            onerror: reject
          });
        };

        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    const initClient = async () => {
      try {
        await window.gapi.client.init({
          apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
          discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/fitness/v1/rest"],
        });
      } catch (err) {
        console.error('Google API init error:', err);
        throw new Error('Failed to initialize Google API client');
      }
    };

    const fetchDataWithRetry = async () => {
      try {
        setIsLoading(true);

        while (retryCount < maxRetries) {
          try {
            await loadGAPI();
            await initClient();
            break;
          } catch (err) {
            retryCount++;
            if (retryCount >= maxRetries) throw err;
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
          }
        }

        if (!isMounted) return;

        // Updated time calculations
        const now = new Date();
        const todayStart = new Date(now);
        todayStart.setHours(0, 0, 0, 0);

        // Use current time instead of end of day
        const todayEnd = now.getTime();
        console.log("Today Start (Local):", todayStart.toLocaleString());
        console.log("Today End (UTC ms):", todayEnd);
        console.log("Today End (Local):", new Date(todayEnd).toLocaleString());

        const weekStart = new Date(todayStart);
        weekStart.setDate(weekStart.getDate() - 7);

        const [steps, calories] = await Promise.all([
          fetchSteps(token, todayStart.getTime(), todayEnd, weekStart.getTime()),
          fetchCalories(token, todayStart.getTime(), todayEnd, weekStart.getTime())
        ]);

        if (isMounted) {
          setTodaySteps(steps.today);
          setWeeklySteps(steps.weekly);
          setTodayCalories(calories.today);
          setWeeklyCalories(calories.weekly);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Google Fit Error:', error);
          setError(error.message || 'Failed to load fitness data');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchDataWithRetry();

    return () => {
      isMounted = false;
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, [token]);

  const fetchSteps = async (token, todayStart, todayEnd, weekStart) => {
    const today = await fetchStepCount(token, todayStart, todayEnd);
    const weekly = await fetchStepCount(token, weekStart, todayEnd);
    return { today, weekly };
  };

  const fetchCalories = async (token, todayStart, todayEnd, weekStart) => {
    const today = await fetchCalorieExpenditure(token, todayStart, todayEnd);
    const weekly = await fetchCalorieExpenditure(token, weekStart, todayEnd);
    return { today, weekly };
  };

  const fetchStepCount = async (token, startTime, endTime) => {
    const response = await fetch("https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        aggregateBy: [{
          dataTypeName: "com.google.step_count.delta",
          // Changed to merge_step_deltas for more accurate data
          dataSourceId: "derived:com.google.step_count.delta:com.google.android.gms:merge_step_deltas"
        }],
        // Smaller bucket size for more granular data
        bucketByTime: { durationMillis: 3600000 }, // 1-hour buckets
        startTimeMillis: startTime,
        endTimeMillis: endTime
      })
    });

    if (!response.ok) throw new Error('Failed to fetch steps');

    const data = await response.json();
    return calculateTotalSteps(data);
  };

  const fetchCalorieExpenditure = async (token, startTime, endTime) => {
    const response = await fetch("https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        aggregateBy: [{
          dataTypeName: "com.google.calories.expended",
          dataSourceId: "derived:com.google.calories.expended:com.google.android.gms:merge_calories_expended"
        }],
        bucketByTime: { durationMillis: 86400000 },
        startTimeMillis: startTime,
        endTimeMillis: endTime
      })
    });

    if (!response.ok) throw new Error('Failed to fetch calories');

    const data = await response.json();
    return calculateTotalCalories(data);
  };

  const calculateTotalSteps = (data) => {
    return data.bucket?.reduce((total, bucket) => {
      const points = bucket.dataset?.[0]?.point || [];
      return total + points.reduce((sum, point) => {
        return sum + (point.value?.[0]?.intVal || 0);
      }, 0);
    }, 0) || 0;
  };

  const calculateTotalCalories = (data) => {
    return data.bucket?.reduce((total, bucket) => {
      const points = bucket.dataset?.[0]?.point || [];
      return total + points.reduce((sum, point) => {
        return sum + (point.value?.[0]?.fpVal || 0);
      }, 0);
    }, 0) || 0;
  };

  return {
    todaySteps,
    weeklySteps,
    todayCalories,
    weeklyCalories,
    isLoading,
    error
  };
};

export default useFitnessData;