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
    set_epic(params[:epic])
    issue_service.load
    @issues = current_query.issues
    @rels = current_query.linked_rels(type)

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
    @issue_service ||= IssueService.new(force_update: params[:force])
  end

  def current_query
    @current_query ||= Query.find_by(jql: issue_service.jql)
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
