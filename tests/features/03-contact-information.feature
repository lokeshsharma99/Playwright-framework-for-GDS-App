@contact-information
Feature: Contact Information — Step 2 of 4
  As a benefit applicant
  I want to provide my contact details and address
  So that DWP can communicate with me about my application

  Background:
    Given I am on the GDS benefits landing page
    And I start a "universal-credit" application
    And I complete the personal details step with valid data

  @smoke
  Scenario: Contact information form is displayed with the correct structure
    Then I should be on the "Contact Information" page
    And I should see the progress indicator "Step 2 of 4"
    And I should see the "Email address" field
    And I should see the "UK telephone number" field
    And I should see the "Address line 1" field
    And I should see the "Town or city" field
    And I should see the "Postcode" field

  @smoke
  Scenario: All contact fields are optional — empty form advances to the next step
    When I click continue
    Then I should be on the "Additional Information" page

  @smoke
  Scenario: Completing all contact details and continuing
    When I fill in my contact details with valid data
    And I click continue
    Then I should be on the "Additional Information" page

  @validation
  Scenario: An invalid email address shows a validation error
    When I enter email address "not-a-valid-email"
    And I click continue
    Then I should see an error for the "email" field
    And the error should mention "email address"

  @validation
  Scenario: A valid email address is accepted without error
    When I enter email address "applicant@example.com"
    And I click continue
    Then I should be on the "Additional Information" page

  @validation
  Scenario: An invalid UK postcode shows a validation error
    When I enter postcode "NOTVALID"
    And I click continue
    Then I should see an error for the "postcode" field

  @validation
  Scenario: A valid UK postcode is accepted without error
    When I enter postcode "SW1A 2AA"
    And I click continue
    Then I should be on the "Additional Information" page

  Scenario: Previous button navigates back to personal details
    When I click previous
    Then I should be on the "Personal Details" page

  # DELIBERATE FAIL — verifies CI correctly reports failures
  @wip @xfail
  Scenario: [EXPECTED FAIL] Contact page should display a non-existent field
    Then I should see the "Sort code" field
