@confirmation
Feature: Application Confirmation — Step 4 of 4
  As a benefit applicant who has submitted their application
  I want to see a confirmation screen
  So that I know my application has been received and I understand what happens next

  Background:
    Given I have completed a full Universal Credit application

  @smoke
  Scenario: Confirmation page is displayed with the submission heading
    Then I should be on the "Confirmation" page
    And I should see the heading "Application submitted"

  @smoke
  Scenario: A unique application reference number is generated
    Then I should see a reference number starting with "UC-"

  Scenario: User is notified that a confirmation email has been sent
    Then I should see the text "We have sent you a confirmation email."

  Scenario: Application summary section shows submitted data
    Then I should see the "Application summary" section
    And the summary should display my submitted first name
    And the summary should display my submitted last name

  Scenario: What happens next section explains the review process
    Then I should see the "What happens next" section
    And I should see the text "5 working days"

  Scenario: A link to Universal Credit information is displayed
    Then I should see a link to "Find out more about Universal Credit"

  @smoke
  Scenario: Returning to services resets the application and returns to the landing page
    When I click "Return to services"
    Then I should be on the landing page
    And the start button should be disabled
