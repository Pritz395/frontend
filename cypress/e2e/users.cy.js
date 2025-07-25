describe('Users Page', () => {
  beforeEach(() => {
    cy.login('admin@company.com', 'password');
  });

  it('should display users table', () => {
    cy.visit('/users');
    cy.contains(/users/i).should('exist');
    cy.get('table').should('exist');
  });
}); 