export interface User {
  id: string;
  name: string;
  email: string;
}

export const formatUserName = (user: User) => {
  return `${user.name} (${user.email})`;
};
