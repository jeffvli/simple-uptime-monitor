import axios from "axios";
import useSWR from "swr";

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

export const fetcher = (url) => api.get(url).then((res) => res.data);

// Return the monitor list
export const useMonitors = (refreshInterval) => {
  const { data, error } = useSWR(`/monitors/`, fetcher, {
    refreshInterval: refreshInterval,
    revalidateOnFocus: false,
  });

  return {
    monitors: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useCurrentStatus = (refreshInterval = 0) => {
  const { data, error } = useSWR(`/currentstatus/`, fetcher, {
    refreshInterval: refreshInterval,
    revalidateOnFocus: false,
  });

  return {
    currentStatus: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useUptime = (refreshInterval = 0) => {
  const { data, error } = useSWR(`/uptime/`, fetcher, {
    refreshInterval: refreshInterval,
    revalidateOnFocus: false,
  });

  return {
    uptime: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useGlobalStats = (refreshInterval = 0) => {
  const { data, error } = useSWR(`/globalstats/`, fetcher, {
    refreshInterval: refreshInterval,
    revalidateOnFocus: false,
  });

  return {
    globalStats: data,
    isLoading: !error && !data,
    isError: error,
  };
};
