import type { NextRequest } from 'next/server';
import { APIClient } from "./duo";


//TODO: Convert to ENV variables
const username = "sherrao15"
const email = "SherRao15@gmail.com";

const login = async () => {
    const duo = new APIClient("https://www.duolingo.com");
    const token = await duo.login(username, password);
    const result = await duo.fetchData(username, token);
    console.log(result);
    return result;
}


export const GET = async (request: NextRequest) => {
    // const loginResponse = await login();
    // if (loginResponse.status == "bad")
    //     return Response.json(loginResponse.json);

    // const response = await fetch(`https://duolingo.com/api/v1/users/show?username=${username}`);
    // if (!response.ok)
    //     return Response.json({ message: `GET: ${response.status} : ${response.statusText}` });


    // const result = await response.json();
    // console.log(result);

    await login();
    return Response.json({ message: "congrats" });
}