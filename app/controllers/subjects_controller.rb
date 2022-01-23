class SubjectsController < ApplicationController
    def show
        if logged_in? && curr_user
            @validsubjects = @curr_user.subjects
            @subject = @validsubjects.find(params[:subject_id])
            @events = @subject.events
            if @subject
                # subject belongs to current user
                render json: {
                    subject_found: true,
                    subject: @subject,
                    events: @events,
                    tasks: @subject.tasks
                }
            else
                render json: {
                    subject_found: false,
                    message: "Subject not found"
                }
            end
        else
            render json: {
                subject_found: false,
                message: "Invalid user"
            }
        end
    end

    def create
        if logged_in? && curr_user
            @subject = Subject.new(subject_params)
            if @subject.save
                render json: {
                    subject_created: true,
                    subject_id: @subject.id
                }
            else
                render json: {
                    subject_created: false,
                    message: "Could not create subject"
                }
            end
        else
            render json: {
                subject_created: false,
                message: "Unauthorised user"
            }
        end
    end

    def delete
        if logged_in? && curr_user
            # ensure that this subject belongs to the user and he is authorised to delete it
            @subjects = @curr_user.subjects
            @subject = @subjects.find(params[:subject_id])
            if @subject.destroy
                render json: {
                    subject_deleted: true
                }
            else
                render json: {
                    subject_deleted: false,
                    message: "Failed to delete subject"
                }
            end
        else
            render json: {
                subject_deleted: false,
                message: "Unauthorised user"
            }
        end
    end

    def update
        if logged_in? && curr_user
            @subject = Subject.find(params[:subject_id])
            if @subject.update(subject_params)
                render json: {
                    successful: true,
                    subject_id: @subject.id
                }
            else
                render json: {
                    successful: false,
                    message: "failed to update subject"
                }
            end
        else
            render json: {
                successful: false,
                message: "unauthorised user"
            }
        end
    end

    private
    def subject_params
        params.require(:subject).permit(:title, :description, :color, :user_id)
    end
end