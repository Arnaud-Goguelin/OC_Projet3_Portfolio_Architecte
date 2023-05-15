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
        // Réaffichage des works dans la modale et sur la page d'accueil suite à la suppression du work ciblé
        let remainingWorks = works.filter(work => work.id != figureId);
        answerAPIDelete.ok ? createWorksModal(remainingWorks) : null;
        answerAPIDelete.ok ? createWorks(remainingWorks) : null;
        //MAJ du tableau works
        let workToSplice = works.findIndex(work => work.id == figureId);
        works.splice(workToSplice, 1)

    } catch(error) {

        console.error(error);

    }                
}

