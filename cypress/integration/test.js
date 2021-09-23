/// <reference types="Cypress" /> 
const URL = "http://127.0.0.1:8080";
const pokemonsQuantity=898;

describe('Test App', ()=>{
    let cardsPerPage;
    let availablePages;

    beforeEach(()=>{
        cy.intercept(/^https:\/\/pokeapi\.co\/api\/v2\/pokemon\/\d+\//, {fixture: 'pokemon-1.json'}).as('interceptImagesSource');
    })

    it('Asserts cards quantity and available pages', ()=>{
        cy.visit(URL);

        cy.intercept(/^https:\/\/pokeapi\.co\/api\/v2\/pokemon\/\?offset=\d+&limit=\d+$/, {fixture: 'firstPokemonsList.json'}).as('firstPokemonList');
        

        cy.get('.cards-container article').then(articles => { 
            cardsPerPage = articles.length;
            cy.get(`#pokemon-${cardsPerPage}`).should('be.visible');
            cy.get(`#pokemon-${cardsPerPage+1}`).should('not.exist');
        }).then(()=>{
            availablePages = Math.ceil(pokemonsQuantity/cardsPerPage);
            cy.get('#totalPages').should('contain.text', availablePages);
            cy.get('button#previous-page').should('not.be.visible');
        })
    })
    it('Goes to next page and asserts continuity', ()=>{
        cy.get('button#next-page').click();
        
        cy.intercept(/^https:\/\/pokeapi\.co\/api\/v2\/pokemon\/\?offset=\d+&limit=\d+$/, {fixture: 'secondPokemonsList.json'}).as('secondPokemonList');
        cy.get(`#pokemon-${cardsPerPage+1}`).should('be.visible');
        cy.get(`#pokemon-${cardsPerPage*2}`).should('be.visible');
        cy.get(`#pokemon-${cardsPerPage*2+1}`).should('not.exist');
    })

    it('Checks funcionality on pager previous button visibility', ()=>{
        cy.get('button#previous-page').should('be.visible').click();

        cy.intercept(/^https:\/\/pokeapi\.co\/api\/v2\/pokemon\/\?offset=\d+&limit=\d+$/, {fixture: 'firstPokemonsList.json'}).as('firstPokemonList');
        
        cy.get('button#previous-page').should('not.be.visible');
    })

    it('Checks functionality of page input validation', ()=>{
        cy.get('#requiredPage').type(`{backspace}${availablePages+1}{enter}`);
        cy.get('.warning-container').should('be.visible').should('have.text', `La pagina debe ser menor o igual a ${availablePages}`);
        
        cy.get('#requiredPage').type("{backspace}{backspace}0{enter}");
        cy.get('.warning-container').should('be.visible').should('have.text', 'La pagina debe ser igual o meyor a 1');
    })

    it('Checks funcionality of pager input and pager next button visibility', ()=>{
        cy.intercept(/^https:\/\/pokeapi\.co\/api\/v2\/pokemon\/\?offset=\d+&limit=\d+$/, {fixture: 'lastPokemonsList.json'}).as('lastPokemonsList');
        
        cy.get('#requiredPage').type(`{backspace}${availablePages}{enter}`);

        cy.wait('@lastPokemonsList');

        cy.get('.warning-container').should('not.exist');

        cy.get('button#next-page').should('not.be.visible');        

        cy.intercept(/^https:\/\/pokeapi\.co\/api\/v2\/pokemon\/\?offset=\d+&limit=\d+$/, {fixture: 'penultimatePokemonsList.json'}).as('penultimatePokemonsList');
        
        cy.get('button#previous-page').should('be.visible').click();
        
        cy.wait('@penultimatePokemonsList');

        cy.intercept(/^https:\/\/pokeapi\.co\/api\/v2\/pokemon\/\?offset=\d+&limit=\d+$/, {fixture: 'lastPokemonsList.json'}).as('lastPokemonList');
        
        cy.get('button#next-page').should('be.visible').click();
        
        cy.wait('@interceptImagesSource');

        cy.get('button#next-page').should('not.be.visible');
    })

    it('Request for last pokemons details, check functionality of overlay and next pokemon button vissibility', ()=>{
        cy.intercept(/^https:\/\/pokeapi\.co\/api\/v2\/pokemon\/\d+\//, {fixture: 'pokemon-898.json'}).as('lastPokemonDetails');
        
        cy.get('.cards-container article').then(articles =>{
            let index = articles.length-1;
            articles[index].click();
            cy.wrap(articles[index]).find('h2').invoke('text').as('lastPokemonName').then(function(){
                cy.get('.overlay').should('have.css', 'transform', 'none');
                cy.get('.pokemon-details').should('include.text', this.lastPokemonName);
                cy.get('#next-pokemon').should('not.be.visible')
            })
            cy.intercept(/^https:\/\/pokeapi\.co\/api\/v2\/pokemon\/\d+\//, {fixture: 'pokemon-897.json'}).as('penultimatePokemonDetails');
            cy.get('#previous-pokemon').click();
            cy.wrap(articles[index-1]).find('h2').invoke('text').as('penultimatePokemonName').then(function(){
                cy.get('.pokemon-details').should('include.text', this.penultimatePokemonName);
                cy.get('#next-pokemon').should('be.visible');
            })
            cy.intercept(/^https:\/\/pokeapi\.co\/api\/v2\/pokemon\/\d+\//, {fixture: 'pokemon-898.json'}).as('lastPokemonDetails');
            cy.get('#next-pokemon').click();
            cy.get('#next-pokemon').should('not.be.visible');

            cy.intercept(/^https:\/\/pokeapi\.co\/api\/v2\/pokemon\/\d+\//, {fixture: 'pokemon-897.json'}).as('penultimatePokemonDetails');
            cy.get('#previous-pokemon').click(); //OJO, REVISAR
            cy.wait(500)
        })
        
        cy.get('.overlay .close-button').click();
        cy.get('.overlay').should('have.css', 'transform', 'matrix(0.5, 0, 0, 0.5, -1000, 0)');
    })

    it('Checks the update of page when navigating pokemons with overlay buttons, and visibility of overlay previous', ()=>{
        
        cy.get('.cards-container article').then(articles =>{
            articles[0].click();
            cy.get('#previous-pokemon').should('not.be.visible');
            cy.intercept(/^https:\/\/pokeapi\.co\/api\/v2\/pokemon\/\d+\//, {fixture: 'pokemon-2.json'}).as('nextPokemonDetails');
            cy.get('#next-pokemon').click();
            cy.get('#previous-pokemon').should('be.visible');
            cy.intercept(/^https:\/\/pokeapi\.co\/api\/v2\/pokemon\/\d+\//, {fixture: 'pokemon-1.json'}).as('firstPokemonDetails');
            cy.get('#previous-pokemon').click();
            cy.get('#previous-pokemon').should('not.be.visible');
            cy.get('.overlay .close-button').click();
            cy.get('#requiredPage').should('have.value', 1);
        })

    })

    it('Checks the correct display and pull out of type details', ()=>{
        cy.get('.cards-container article').then(articles =>{
            articles[0].click();
            cy.wait('@interceptImagesSource')
            cy.get('.types-div button').then( typeButtons =>{
                typeButtons[0].click();
                cy.get('.type-details').should('be.visible');
                cy.get('.relations-type-container').should('have.length', 2);
                cy.get('.related-types-container').should('have.length', 4);
                cy.get('.related-types-container p').should('have.length.at.least', 2);
            })
            cy.get('#next-pokemon').click();
            cy.get('.type-details').should('not.exist');
            cy.get('.types-div button').then( typeButtons =>{
                typeButtons[0].click();
                cy.get('.type-details').should('be.visible');
            })

            cy.get('.overlay .close-button').then( closeButtons =>{
                closeButtons[closeButtons.length-1].click()
                cy.get('.type-details').should('not.exist');
            })
        })
    })

})