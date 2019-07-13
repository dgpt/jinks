class IssuesController < ApplicationController
  # GET /issues
  #
  # Returns issues matching a filter
  # Limited to 300 issues at a time
  #
  # Query Parameters
  #   type - String; "dependent", "caused", "relates"
  #   epic - String; Jira Key
  def index
    set_epic(params[:epic])
    query = issue_service.load
    @issues = query.issues
    @rels = query.links(type)

    render :index, formats: :json
  end

  # PUT /issues/:id
  #
  # Updates issues from Jira
  # Limited to 300 issues at a time
  #
  # Request Parameters
  def update
    Issue.find_by(jira_id: params[:id])
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
    @issue_service ||= IssueService.new(force_update: params[:force])
  end

  def issue_params
    params.fetch(:issue, {})
  end

  def set_epic(epic)
    if epic
      issue_service.epic(epic)
    end
  end

  def type
    params[:type]&.upcase&.to_sym
  end
end
