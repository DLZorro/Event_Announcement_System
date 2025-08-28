import axios from 'axios';

const API_URL = 'https://a4xifoa6xb.execute-api.ap-south-1.amazonaws.com/prod/events';

export interface Event {
  eventId: string;
  title: string;
  description?: string;
  date: string;
  location?: string;
  createdAt: string;
}

export const createEvent = async (eventData: Omit<Event, 'eventId' | 'createdAt'>): Promise<Event> => {
  const response = await axios.post(API_URL, eventData);
  return response.data;
};

export const getEvents = async (): Promise<Event[]> => {
  try {
    const response = await axios.get(API_URL);
    return response.data || []; // Ensure we always return an array
  } catch (error) {
    console.error('Error fetching events:', error);
    return []; // Return empty array on error
  }
};