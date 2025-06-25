export interface Task {
  id: string;
  text: string;
  createdAt: number;
}

export interface CompletedTask extends Task {
  completedAt: number;
  weather: {
    city: string;
    description: string;
    temp: number;
  };
}
