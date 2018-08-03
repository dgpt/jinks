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
    @nodes = @issues.linked_nodes(type)
    @edges = @issues.linked_rels(type)
    render :index, formats: :json
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
  # Use callbacks to share common setup or constraints between actions.
  def set_issue
    @issue = Issue.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def issue_params
    params.fetch(:issue, {})
  end

  def filter_by_epic(scope)
    epic = params[:epic]
    !!epic ? scope.where(epic: epic) : scope
  end

  def type
    params[:type]&.upcase&.to_sym
  end
end
