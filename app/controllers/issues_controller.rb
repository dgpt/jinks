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
    issue_service.epic(epic) if epic

    query = issue_service.load
    @issues = query.issues
    @rels = query.links(type)

    render :index, formats: :json
  end

  private

  def issue_service
    @issue_service ||= IssueService.new(force_update: params[:force])
  end

  def issue_params
    params.fetch(:issue, {})
  end

  def epic
    params[:epic]
  end

  def type
    params[:type]&.upcase&.to_sym
  end
end
