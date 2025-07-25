describe('Login Page', () => {
  it('should log in with valid credentials', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('admin@company.com'); // Use a real user
    cy.get('input[name="password"]').type('password');       // Use the correct password
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    cy.contains('Dashboard').should('exist');
  });
});
