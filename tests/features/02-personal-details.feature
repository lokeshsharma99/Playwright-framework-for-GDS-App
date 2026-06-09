@personal-details
Feature: Personal Details — Step 1 of 4
  As a benefit applicant
  I want to provide my personal details
  So that the DWP can identify me and process my application

  Background:
    Given I am on the GDS benefits landing page
    And I start a "universal-credit" application

  @smoke
  Scenario: Personal details form is displayed with the correct structure
    Then I should be on the "Personal Details" page
    And I should see the progress indicator "Step 1 of 4"
    And I should see the "First name" field
    And I should see the "Last name" field
    And I should see the date of birth fields
    And I should see the "National Insurance number" field

  @smoke
  Scenario: All personal details fields are optional — empty form advances
    When I click continue
    Then I should be on the "Contact Information" page

  @smoke
  Scenario: Completing all personal detail fields and continuing
    When I fill in my personal details with valid data
    And I click continue
    Then I should be on the "Contact Information" page

  @validation
  Scenario: National Insurance number in wrong format shows a validation error
    When I enter National Insurance number "WRONGFORMAT"
    And I click continue
    Then I should see an error for the "National Insurance number" field
    And the error should mention "correct format"

  @validation
  Scenario: National Insurance number in the correct format is accepted
    When I enter National Insurance number "AB 12 34 56 C"
    And I click continue
    Then I should be on the "Contact Information" page

  @validation
  Scenario: First name exceeding 70 characters triggers a length validation error
    When I enter a first name of 71 characters
    And I click continue
    Then I should see an error mentioning "70 characters"

  @validation
  Scenario: Date of birth in the future is rejected
    When I enter date of birth "01" "01" "2099"
    And I click continue
    Then I should see a date of birth error mentioning "past"

  @validation
  Scenario: Partially entered date of birth triggers an incomplete date error
    When I enter date of birth day "15" without month and year
    And I click continue
    Then I should see a date of birth error mentioning "month"

  @validation
  Scenario: Validation failure shows an error summary with a link to the problem
    When I enter National Insurance number "BADFORMAT"
    And I click continue
    Then I should see an error summary with "There is a problem"
    And the error summary should link to the National Insurance field

  @validation
  Scenario: Page stays on personal details when validation fails
    When I enter National Insurance number "BADFORMAT"
    And I click continue
    Then I should be on the "Personal Details" page

  Scenario: Back link returns to the landing page
    When I click back
    Then I should be on the landing page
