class IssuesController < ApplicationController
  # GET /issues
  #
  # Returns issues matching a filter
  # Limited to 300 issues at a time
  #
  # Query Parameters
  #   type - String; "dependent", "caused"
  #   epic - String; Jira Key
  def index
    @issues = filter_by_epic(Issue.all(:issue))
    @rels = @issues.linked_rels(type)

    issue_service.load
    render :index, formats: :json
  end

  # PUT /issues
  #
  # Updates issues from Jira
  # Limited to 300 issues at a time
  #
  # Request Parameters
  def update
  end

  # POST /issues
  #
  # Imports issues from Jira
  # Limited to 300 issues at a time
  #
  # Request Parameters
  #   jql
  #   epic
  def create
  end

  private
  def issue_service
    IssueService.new(force_update: params[:force])
  end

  def issue_params
    params.fetch(:issue, {})
  end

  def filter_by_epic(scope)
    epic = params[:epic]
    if epic
      issue_service.epic(epic)
      scope.where(epic: epic)
    end
  end

  def type
    params[:type]&.upcase&.to_sym
  end
end
