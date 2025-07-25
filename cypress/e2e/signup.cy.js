describe('Signup Page', () => {
  it('should sign up a new user and redirect to login', () => {
    const randomEmail = `testuser_${Date.now()}@example.com`;
    cy.visit('/signup');
    cy.get('input[name="firstName"]').type('Test');
    cy.get('input[name="lastName"]').type('User');
    cy.get('input[name="email"]').type(randomEmail);
    cy.get('input[name="password"]').type('TestPassword123!');
    cy.get('input[name="organizationName"]').type(`Org${Date.now()}`);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/login');
    cy.contains(/log in/i).should('exist');
  });
}); 