@additional-information
Feature: Additional Information — Step 3 of 4
  As a benefit applicant
  I want to provide additional details about my employment and circumstances
  So that DWP has all the information needed to assess my application

  Background:
    Given I am on the GDS benefits landing page
    And I start a "universal-credit" application
    And I complete the personal details step with valid data
    And I complete the contact information step with valid data

  @smoke
  Scenario: Additional information form is displayed with the correct structure
    Then I should be on the "Additional Information" page
    And I should see the progress indicator "Step 3 of 4"
    And I should see the "Employment status" field
    And I should see the "Additional information" field

  Scenario: Employment status dropdown contains all expected options
    Then the employment status dropdown should contain "Employed"
    And the employment status dropdown should contain "Self-employed"
    And the employment status dropdown should contain "Unemployed"
    And the employment status dropdown should contain "Student"
    And the employment status dropdown should contain "Retired"
    And the employment status dropdown should contain "Other"

  @smoke
  Scenario: Submitting without selecting any options advances to confirmation
    When I click submit application
    Then I should be on the "Confirmation" page

  Scenario: Completing all additional information fields and submitting
    When I select employment status "Employed"
    And I enter additional information "No additional information to provide."
    And I click submit application
    Then I should be on the "Confirmation" page

  Scenario Outline: Each employment status option can be selected
    When I select employment status "<status>"
    And I click submit application
    Then I should be on the "Confirmation" page

    Examples:
      | status        |
      | Employed      |
      | Self-employed |
      | Unemployed    |
      | Student       |
      | Retired       |
      | Other         |

  Scenario: Previous button navigates back to contact information
    When I click previous
    Then I should be on the "Contact Information" page
