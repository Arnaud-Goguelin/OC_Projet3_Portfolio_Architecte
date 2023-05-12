import {works, token, createWorks} from "./home.js"

export async function deleteSelectedWork(event) {

    try {

        const answerAPIDelete = await fetch (`http://localhost:5678/api/works/${event.target.id}`, {
            method: "DELETE",
            headers: {"Authorization" : `Bearer ${token}`},
        });

        // let remainingWorks = works.filter(work => work.id != event.target.id);
        // console.log(remainingWorks)
        // answerAPIDelete.ok ? createWorksModal(remainingWorks) : null;
        // answerAPIDelete.ok ? createWorks(remainingWorks) : null;
        // remainingWorks = null;
        // console.log(remainingWorks);
        if (answerAPIDelete.ok) { 
            const worksToRemove = document.querySelectorAll(`#work${event.target.id}`);
            worksToRemove.forEach(work => work.remove());
        }

    } catch(error) {

        console.error(error);

    }                
}

