export async function GET() {
    try {
      const response = await fetch('https://www.dota2.com/webapi/ILobbies/GetJoinableCustomLobbies/v0001/', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'application/json'
        },
        next: { revalidate: 30 } // Revalidate data every 30 seconds
      });
  
      if (!response.ok) {
        return Response.json({ error: `Error fetching lobbies: ${response.status} ${response.statusText}` }, { status: response.status });
      }
  
      const data = await response.json();
      
      return Response.json({ data });
    } catch (error) {
      console.error('Error fetching lobbies:', error);
      return Response.json({ error: 'Failed to fetch lobbies' }, { status: 500 });
    }
  }
  