const findUser = (username: string | null): User | null => {
    if (!username) return null; // If username is null, return null
  
    // Get the stored users from localStorage
    const usersData = localStorage.getItem('forum/users');
    
    if (!usersData) {
      return null; // No users in localStorage
    }
  
    // Parse the users data from JSON string to an array
    const allUsers: User[] = JSON.parse(usersData);
  
    // Find the user by username
    const user = allUsers.find(user => user.userName === username);
  
    return user || null; // Return the user if found, otherwise return null
  };

export default findUser