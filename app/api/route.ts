export async function GET(request: Request){
    const users = [
        {id:1 , name:"lapplace"},
        {id:4 , name:"yogurt" }
    ];

    return new Response(JSON.stringify(users), {
        status: 200 
    });


}