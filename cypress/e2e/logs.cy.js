describe('Logs Page', () => {
  beforeEach(() => {
    cy.login('admin@company.com', 'password');
  });

  it('should display logs table', () => {
    cy.visit('/logs');
    cy.contains(/activity logs/i).should('exist');
    cy.get('table').should('exist');
  });
}); 