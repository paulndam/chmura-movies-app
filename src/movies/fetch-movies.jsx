import React, { useEffect, useState } from 'react';
import api from '../api/api';
import "./movies.css"

const FetchMovies = () => {
    const [, setMovies] = useState([])
    const [, setActors] = useState([])
    const [filteredActors, setFilteredActors] = useState([])
    const [, setValidateResponse] = useState(null)



    useEffect(() => {
        const fetch = async () => {
            try {

                // call to fetch movies
                const movieResponse = await api.get("movies")
                setMovies(movieResponse.data)

                // call to fetch actors
                const actorResponse = await api.get("actors")
                setActors(actorResponse.data)


                // Find the ID for Nicolas Cage & Keanu Reeves.
                const reevesId = actorResponse?.data.find((a)=> a.name === 'Keanu Reeves')?.actorId
                const cageId = actorResponse?.data.find((a) => a.name === 'Nicolas Cage')?.actorId

                // Movies with Nicolas Cage.
                const cageMovies = movieResponse?.data?.filter((m) => m.actors.includes(cageId)).flatMap((m) => m?.actors)

                // Movies with Keanu Reeves
                const reevesMovies = movieResponse?.data?.filter((m) => m.actors.includes(reevesId)).flatMap((m) => m?.actors)

                // Look for actor IDs that exist in both list.
                const coActors = cageMovies.filter((id) => reevesMovies.includes(id))

                // Getting details of relevant actors that were in movies with cage and reeves
                const relevantActorsData = actorResponse?.data?.filter((a) => coActors.includes(a?.actorId) && a?.actorId !== cageId && a?.actorId !== reevesId).map(
                    (actor => {
                        // finding movies that an actor appeared in with Nicolas Cage
                        const actorsMoviesWithCage = movieResponse?.data.filter((m) => m?.actors?.includes(cageId) && m?.actors?.includes(actor?.actorId)).map((m)=>m.title)

                        // finding movies that an actor appeared in with Keanu Reeves
                        const actorsMoviesWithReeves = movieResponse?.data.filter((m) => m?.actors?.includes(reevesId) && m?.actors?.includes(actor?.actorId)).map((m)=>m.title)

                        return {
                            actor,
                            cageMovies: actorsMoviesWithCage,
                            reevesMovies: actorsMoviesWithReeves
                        }
                    })
                )

                setFilteredActors(relevantActorsData)

                // Once data is set, prepare for validation.
                const results = relevantActorsData.map(actorData => {
                    return {
                        Name: actorData.actor.name,
                        KRMovies: actorData.reevesMovies,
                        NCMovies: actorData.cageMovies
                    }
                })

                const response = await api.post("validation", results)

                setValidateResponse(response)


            } catch (err) {
                console.log(err)
            }
        }
        fetch()
    }, [])

    return (
        <>

            <h2>List Of Actors In A Nicolas Cage & Keanu Reeves Movie </h2>

            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Movies with Nicolas Cage</th>
                    <th>Movies with Keanu Reeves</th>
                </tr>
                </thead>

                <tbody>
                {
                    filteredActors.map((data) => (
                        <tr key={data.actor.actorId}>
                            <td>{data.actor.name}</td>
                            <td>{data.cageMovies.join(', ')}</td>
                            <td>{data.reevesMovies.join(', ')}</td>
                        </tr>
                    ))
                }
                </tbody>
            </table>

        </>
    );
}

export default FetchMovies;
