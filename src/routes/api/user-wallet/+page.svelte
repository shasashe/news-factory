<script>
    import { onMount } from 'svelte';
  
    onMount(async () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MjU3MjMwOTMsImlhdCI6MTcyMzEzMTA5MywiaXNzIjoiaHR0cHM6Ly9uZXVjcm9uLmlvIiwianRpIjoiMzVhODI2OWQtMWFlNS00YTg1LTkzNjItODFhMmRjNWI2MGY3IiwibmJmIjoxNzIzMTMxMDkzLCJzdWIiOiJlODY5MDE5Mi1mZWUxLTQ5OGYtOGRmZS00NmY0NWEwMjYwYTAiLCJ1c2VyX2lkIjoiZTg2OTAxOTItZmVlMS00OThmLThkZmUtNDZmNDVhMDI2MGEwIn0.rF7o7Aq_0Oe-qRlGWBF9sxZrz0RqROgDyQnaCCDf08I'; 
  
      try {
        const response = await fetch('/api/user-wallet', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
  
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error('Error:', error);
      }
    });
  </script>
  