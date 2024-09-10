const decipherUser = (token: string): string | null => {
    try {
      const decodedToken = atob(token);
  
      const [username, expiry] = decodedToken.split(':');
  
      const now = new Date();
      const expiryDate = new Date(expiry);
  
      return username
    } catch (error) {
      console.error('Invalid token format');
      return null; // Invalid token
    }
  };

export default decipherUser