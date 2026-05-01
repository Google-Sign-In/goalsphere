
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          /* Base reset */
          * { box-sizing: border-box; }
          /* User CSS */
          
        </style>
        <script>
            // Capture console.log to display in parent (Optional future enhancement, currently just preventing errors)
            window.onerror = function(message, source, lineno, colno, error) {
                console.error('Preview Error:', message);
            };
        </script>
      </head>
      <body>
        // Netlify Serverless Function - Fetches live stream links
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    try {
        // Get the match from query parameter
        const match = event.queryStringParameters?.match || '';
        
        // Multiple sources to fetch stream links
        const streamLinks = [];
        
        // Source 1: Reddit (via free API)
        try {
            const redditResponse = await fetch(
                `https://www.reddit.com/r/soccerstreams/new.json?limit=5`,
                { headers: { 'User-Agent': 'GoalSphere/1.0' } }
            );
            const redditData = await redditResponse.json();
            
            if (redditData.data?.children) {
                redditData.data.children.forEach(post => {
                    if (post.data.title.toLowerCase().includes(match.toLowerCase()) || !match) {
                        streamLinks.push({
                            source: 'Reddit',
                            title: post.data.title,
                            url: `https://reddit.com${post.data.permalink}`,
                            platform: 'reddit'
                        });
                    }
                });
            }
        } catch (err) {
            console.log('Reddit fetch failed:', err.message);
        }
        
        // Source 2: Free Stream aggregator API (example)
        try {
            const streamResponse = await fetch('https://api.sportmonks.com/v3/football/livescores?api_token=demo');
            // Note: Replace with actual free API
        } catch (err) {}
        
        // Source 3: YouTube live search (via no-api)
        const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(match + ' live stream')}`;
        streamLinks.push({
            source: 'YouTube',
            title: `Search on YouTube for "${match}"`,
            url: youtubeSearchUrl,
            platform: 'youtube'
        });
        
        // Source 4: Alternative free streaming sites
        const altSites = [
            { name: 'StreamEast', url: `https://streameast.gg/soccer/${match.replace(/ /g, '-').toLowerCase()}` },
            { name: 'BuffStreams', url: `https://buffstreams.sx/soccer/${match.replace(/ /g, '-').toLowerCase()}` },
            { name: 'SportSurge', url: `https://sportsurge.net/#/events` }
        ];
        
        altSites.forEach(site => {
            streamLinks.push({
                source: site.name,
                title: `Watch on ${site.name}`,
                url: site.url,
                platform: 'external'
            });
        });
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                match: match,
                links: streamLinks.slice(0, 8), // Limit to 8 links
                lastUpdated: new Date().toISOString()
            })
        };
        
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: error.message
            })
        };
    }
};
        <script>
          try {
            
          } catch (err) {
            console.error('Runtime Error:', err);
            document.body.innerHTML += '<div style="color:red; background:#ffe6e6; padding:10px; margin-top:20px; border-radius:4px; border:1px solid red;"><strong>Runtime Error:</strong> ' + err.message + '</div>';
          }
        </script>
      </body>
    </html>
  