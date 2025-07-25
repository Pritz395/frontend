describe('Dashboard Page', () => {
  beforeEach(() => {
    cy.login('admin@company.com', 'password'); // You can implement a custom command for login
  });
 
  it('should display dashboard stats', () => {
    cy.visit('/dashboard');
    cy.contains(/total users|active users|logs today/i).should('exist');
  });
}); 