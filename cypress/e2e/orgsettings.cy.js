describe('Org Settings Page', () => {
  beforeEach(() => {
    cy.login('admin@company.com', 'password');
  });
 
  it('should display organization info', () => {
    cy.visit('/settings');
    cy.contains(/organization|plan/i).should('exist');
  });
}); 