// <reference types="cypress"/>
context(`Home page user tests`, () => {
  // setup
  beforeEach(() => {
    cy.visit(`http://localhost:3000`);
  });
  // tests
  it(`should have title  and text indicating guest user section`, () => {
    cy.get(`h1`).should(`include.text`, `Next.js Project Starte`);
  });
  it(`should have a button that clicked exposes test text`, () => {
    cy.findByText(`Test text`).should(`not.exist`);
    cy.findByRole(`button`, { name: /Test Button/i }).click();
    cy.findByText(`Test text`).should(`exist`);
  });
});
