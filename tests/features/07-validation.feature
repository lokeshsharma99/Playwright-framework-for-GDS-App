@validation
Feature: Form Validation — Error Messages and Error Summary
  As a benefit applicant
  I want to see clear, helpful error messages when I submit invalid data
  So that I can understand and correct my mistakes before progressing

  Background:
    Given I am on the GDS benefits landing page
    And I start a "universal-credit" application

  @validation
  Scenario: Error summary is shown when NI number format is invalid
    When I enter National Insurance number "WRONGFORMAT"
    And I click continue
    Then I should see an error summary with "There is a problem"

  @validation
  Scenario: Multiple errors from different fields are all shown in the error summary
    When I enter a first name of 71 characters
    And I enter National Insurance number "BADNI"
    And I click continue
    Then I should see at least 2 errors in the error summary

  @validation
  Scenario: Error summary provides a clickable link to the problematic field
    When I enter National Insurance number "BADFORMAT"
    And I click continue
    Then the error summary should link to the National Insurance field

  @validation
  Scenario: Validation failure keeps the user on the current step
    When I enter National Insurance number "BADFORMAT"
    And I click continue
    Then I should be on the "Personal Details" page

  @validation
  Scenario: Empty date of birth is valid and does not trigger an error
    When I click continue
    Then I should be on the "Contact Information" page

  @validation
  Scenario: Invalid email address on the contact step shows an error
    Given I complete the personal details step with valid data
    When I enter email address "invalidemail"
    And I click continue
    Then I should see an error for the "email" field
    And I should be on the "Contact Information" page
