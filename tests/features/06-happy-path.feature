@happy-path @e2e
Feature: Complete Application Journey — Happy Path
  As a benefit applicant
  I want to complete the full application journey end-to-end
  So that I can successfully submit my benefits application

  @smoke @e2e
  Scenario: Complete a Universal Credit application with all valid data
    Given I am on the GDS benefits landing page
    When I start a "universal-credit" application
    And I fill in my personal details with valid data
    And I click continue
    And I fill in my contact details with valid data
    And I click continue
    And I select employment status "Employed"
    And I click submit application
    Then I should be on the "Confirmation" page
    And I should see a reference number starting with "UC-"

  @e2e
  Scenario: Complete a Housing Benefit application with minimum required data
    Given I am on the GDS benefits landing page
    When I start a "housing-benefit" application
    And I click continue
    And I click continue
    And I click submit application
    Then I should be on the "Confirmation" page

  @e2e
  Scenario: Complete a Jobseeker's Allowance application with minimum required data
    Given I am on the GDS benefits landing page
    When I start a "jobseekers-allowance" application
    And I click continue
    And I click continue
    And I click submit application
    Then I should be on the "Confirmation" page

  @e2e
  Scenario: Progress indicator advances through each step of the application
    Given I am on the GDS benefits landing page
    When I start a "universal-credit" application
    Then I should see the progress indicator "Step 1 of 4"
    When I click continue
    Then I should see the progress indicator "Step 2 of 4"
    When I click continue
    Then I should see the progress indicator "Step 3 of 4"

  @e2e
  Scenario: User can start a second application after returning to services
    Given I have completed a full Universal Credit application
    When I click "Return to services"
    And I start a "housing-benefit" application
    Then I should be on the "Personal Details" page
