@landing-page
Feature: Landing Page — Benefit Selection
  As a benefit applicant
  I want to visit the GOV.UK benefits application landing page
  So that I can select a benefit and start my application

  Background:
    Given I am on the GDS benefits landing page

  @smoke
  Scenario: Page displays the correct document title
    Then the page title should be "Apply for Benefits and Support - GOV.UK"

  @smoke
  Scenario: Main page heading is visible
    Then I should see the heading "Apply for Benefits and Support"

  Scenario: Page has GOV.UK branding elements
    Then the GOV.UK logo should be visible
    And the BETA banner should be visible
    And the skip to main content link should be visible

  @smoke
  Scenario: All three benefit options are available for selection
    Then I should see benefit option "Universal Credit"
    And I should see benefit option "Housing Benefit"
    And I should see benefit option "Jobseeker's Allowance"

  Scenario: Start now button is disabled until a benefit is chosen
    Then the start button should be disabled

  Scenario Outline: Selecting any benefit enables the Start now button
    When I select benefit "<benefitId>"
    Then the start button should be enabled

    Examples:
      | benefitId            |
      | universal-credit     |
      | housing-benefit      |
      | jobseekers-allowance |

  Scenario: Selecting a different benefit deselects the previous one
    When I select benefit "universal-credit"
    And I select benefit "housing-benefit"
    Then the "housing-benefit" radio should be checked
    And the "universal-credit" radio should not be checked

  @smoke
  Scenario: Starting a Universal Credit application navigates to personal details
    When I select benefit "universal-credit"
    And I click start now
    Then I should be on the "Personal Details" page

  Scenario: Before you start section lists required documents
    Then I should see the "Before you start" section
    And the requirements list should mention "National Insurance number"

  Scenario: Help section displays the Universal Credit helpline number
    Then I should see the helpline number "0800 328 5644"

  Scenario: Footer contains key navigation links
    Then the footer should contain a "Help" link
    And the footer should contain a "Cookies" link
    And the footer should contain a "Contact" link
