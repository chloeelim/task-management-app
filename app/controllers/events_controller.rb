class EventsController < ApplicationController
    def show
        if logged_in? && curr_user
            @events = curr_user.events
            @event = @events.find(params[:event_id])
            @subjects = curr_user.subjects
            if @event
                render json: {
                    event_found: true,
                    event: @event,
                    subject: @event.subject,
                    subjects: @subjects
                }
            else
                render json: {
                    event_found: false,
                    message: "Event not found"
                }
            end
        else
            render json: {
                event_found: false,
                message: "User not authorised"
            }
        end
    end

    def create
        if logged_in? && curr_user
            @event = Event.new(event_params)
            if @event.save
                render json: {
                    successful: true,
                    event_title: @event.title
                }
            else
                render json: {
                    successful: false,
                    message: "Could not create event"
                }
            end
        else
            render json: {
                successful: false,
                message: "Unauthorised user"
            }
        end
    end

    def update
        if logged_in? && curr_user
            @event = Event.find(params[:event_id])
            if @event.update(event_params)
                render json: {
                    successful: true
                }
            else
                render json: {
                    successful: false,
                    message: "Could not update event"
                }
            end
        else
            render json: {
                successful: false,
                message: "Unauthorised user"
            }
        end
    end

    def delete
        if logged_in? && curr_user
            @events = @curr_user.events
            @event = @events.find(params[:event_id])
            if @event
                if @event.destroy
                    render json: {
                        deleted_event: true
                    }
                else
                    render json: {
                        deleted_event: false,
                        message: "Could not delete event"
                    }
                end
            else
                render json: {
                    deleted_event: false,
                    message: "No such event"
                }
            end
        else
            render json: {
                deleted_event: false,
                message: "Unauthorised user"
            }
        end
    end

    private
    def event_params
        params.require(:event).permit(:title, :description, :user_id, :subject_id, :start_date, :end_date)
    end
end
