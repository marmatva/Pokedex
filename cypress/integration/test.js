/// <reference types="Cypress" /> 
const URL = "http://127.0.0.1:8080";

describe('Test App', ()=>{
    let cardsPerPage;
    it('Asserts cards quantity', ()=>{
        cy.visit(URL);

        cy.intercept(/^https:\/\/pokeapi\.co\/api\/v2\/pokemon\/\?offset=\d+&limit=\d+$/).as('pokemonInfo')
        cy.wait('@pokemonInfo');

        cy.get('.cards-container article').then(articles => { 
            cardsPerPage = articles.length;
            cy.get(`#pokemon-${cardsPerPage}`).should('be.visible');
            cy.get(`#pokemon-${cardsPerPage+1}`).should('not.exist');
        })   
    })

    it('Test overlay and Details Article functionality', ()=>{
        cy.get('.overlay').should('have.css', 'transform', 'matrix(0.5, 0, 0, 0.5, -1000, 0)');

        cy.get('.cards-container article').then(articles => { 
            let randomNumber = Math.floor(Math.random()*cardsPerPage);
            articles[randomNumber].click();
            cy.wrap(articles[randomNumber]).find('h2').invoke('text').as('firstName').then(function(){
                cy.get('.overlay').should('have.css', 'transform', 'none');
                cy.get('.pokemon-details').should('include.text', this.firstName);

                cy.get('.overlay button').click()
                cy.get('.overlay').should('have.css', 'transform', 'matrix(0.5, 0, 0, 0.5, -1000, 0)');
            })
        })   
    })

    it('Goes to next page and asserts continuity', ()=>{
        cy.get('button#next-page').click();
        cy.get(`#pokemon-${cardsPerPage+1}`).should('be.visible');
        cy.get(`#pokemon-${cardsPerPage*2}`).should('be.visible');
        cy.get(`#pokemon-${cardsPerPage*2+1}`).should('not.exist');
    })
    let currentPage;
    it('Moves forward N pages', ()=>{
        let pagesToMove=Math.ceil(Math.random()*10);
        for(let i=0;i<pagesToMove;i++){
            cy.get('button#next-page').click();
            cy.get('.cards-container article').should('have.length', cardsPerPage);
        }
        currentPage = pagesToMove + 2;
        cy.get(`#pokemon-${(currentPage-1)*cardsPerPage+1}`).should('be.visible');
        cy.get(`#pokemon-${currentPage*cardsPerPage}`).should('be.visible');
        cy.get(`#pokemon-${currentPage*cardsPerPage+1}`).should('not.exist');
    })
    it('Moves backwards 3 pages and checks functionality',()=>{
        currentPage-=3;
        for(let i=0;i<3;i++){
            cy.get('button#previous-page').click();
            cy.get('.cards-container article').should('have.length', cardsPerPage);
        }
        cy.get(`#pokemon-${(currentPage-1)*cardsPerPage+1}`).should('be.visible');
        cy.get(`#pokemon-${currentPage*cardsPerPage}`).should('be.visible');
        cy.get(`#pokemon-${currentPage*cardsPerPage+1}`).should('not.exist');

        cy.get('.cards-container article').then( articles => {
            let randomNumber = Math.ceil(Math.random()*cardsPerPage);
            articles[randomNumber].click();
            cy.wrap(articles[randomNumber]).find('h2').invoke('text').as('secondName').then(function(){
                cy.get('.overlay').should('have.css', 'transform', 'none');
                cy.get('.pokemon-details').should('not.include.text', this.firstName);
                cy.get('.pokemon-details').should('include.text', this.secondName);

                cy.get('.overlay button').click()
                cy.get('.overlay').should('have.css', 'transform', 'matrix(0.5, 0, 0, 0.5, -1000, 0)');
            })
        })
    })
})