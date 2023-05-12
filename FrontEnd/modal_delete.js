import {works, token} from "./home.js"
import {createWorksModal} from "./modal_open_close.js"

export function deleteWork(works) {

    //Attention supprime tous les works...
    for (const work of works) {
            
        // Suppression du work associé au clicl sur le bouton delete
        const modalDeleteButton = document.querySelector(".modal__gallery__delete_button");
        modalDeleteButton.addEventListener("click", deleteSelectedWork);
        
        //Suppression d'un work au clic sur le bouton delete
        async function deleteSelectedWork() {
            try {
                console.log(token);
                const answerAPIDelete = await fetch (`http://localhost:5678/api/works/${work.id}`, {
                    method: "DELETE",
                    headers: {"Authorization" : "Bearer " + token},
                });
                answerAPIDelete.ok ? createWorksModal(works) : null;    
            } catch(error) {
                console.error(error);
            }                
        }
    };
}