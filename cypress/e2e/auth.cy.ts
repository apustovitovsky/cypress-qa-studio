import credentials from "../helpers/mock_credentials.json"
import selectors from "../fixtures/selectors.json"
import prompts from "../fixtures/prompts.json"

describe('Проверка авторизации', () => {

  const login = (email: string, password: string): Cypress.Chainable => {
    return cy.get(selectors.mail).type(email)
      .get(selectors.pass).type(password)
      .get(selectors.loginButton).click();
  }

  const checkMessage = (expected: string): Cypress.Chainable => {
    return cy.get(selectors.messageHeader)
      .should('be.visible')
      .and('contain.text', expected);
  }

  beforeEach(() => {
    cy.visit('/');
    cy.get(selectors.forgotEmailButton)
      .should('have.css', 'color', 'rgb(0, 85, 152)');
  });

  afterEach(() => {
    cy.get(selectors.exitMessageButton).should('be.visible');
  });

  it('Позитивный кейс авторизации', () => {
    login(credentials.email, credentials.password);
    checkMessage(prompts.successLogin);
  });

  it('Восстановление пароля', () => {
    cy.get(selectors.forgotEmailButton).click();
    cy.get(selectors.mailForgot).type(credentials.email);
    cy.get(selectors.restoreEmailButton).click();
    checkMessage(prompts.successRestore);
  });

  it('Негативный кейс — неверный пароль', () => {
    login(credentials.email, 'iLoveqastudio2');
    checkMessage(prompts.wrongCreds);
  });

  it('Негативный кейс — несуществующий email', () => {
    login('fakegerman@dolnikov.ru', credentials.password);
    checkMessage(prompts.wrongCreds);
  });

  it('Негативный кейс валидации', () => {
    login('germandolnikov.ru', credentials.password);
    checkMessage(prompts.validationError);
  });

  it('Приведение логина к нижнему регистру', () => {
    login('German@Dolnikov.ru', credentials.password);
    checkMessage(prompts.successLogin);
  });
});
