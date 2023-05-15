import { works, token, createWorks } from "./home.js"
import { createWorksModal } from "./modal_open_close.js";

export async function deleteSelectedWork(event) {

    let figure = event.target.closest("figure");
    let figureId = figure.dataset.id;

    try {

        const answerAPIDelete = await fetch (`http://localhost:5678/api/works/${figureId}`, {
            method: "DELETE",
            headers: {"Authorization" : `Bearer ${token}`},
        });
        //MAJ du tableau works
        let workToSplice = works.findIndex(work => work.id == figureId);
        works.splice(workToSplice, 1)
        // Réaffichage des works dans la modale et sur la page d'accueil suite à la suppression du work ciblé
        answerAPIDelete.ok ? createWorksModal(works) : null;
        answerAPIDelete.ok ? createWorks(works) : null;


    } catch(error) {

        console.error(error);

    }                
}

