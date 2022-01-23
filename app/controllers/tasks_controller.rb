class TasksController < ApplicationController
    def user_data
        if logged_in? && curr_user
            @tasks = @curr_user.tasks
            @subjects = @curr_user.subjects
            @events = @curr_user.events
            render json: {
                logged_in: true,
                user: @curr_user,
                tasks: @tasks,
                subjects: @subjects,
                events: @events
            }
        else
            render json: {
                logged_in: false
            }
        end
    end

    def create
        # create a new task, ensure user is logged in before creating a task
        if logged_in? && curr_user
            @task = Task.new(task_params)
            if @task.save
               # created task successfully
               render json: {
                   task_created: true
               } 
            else
                render json: {
                    task_created: false,
                    message: "did not manage to create the new task"
                }
            end
        else
            render json: {
                task_created: false,
                message: "invalid user"
            }
        end
    end

    def show
        # show info on task
        if logged_in? && curr_user
            @users_task = @curr_user.tasks
            @task = @users_task.find(params[:task_id])
            @subject = @task.subject_id ? Subject.find(@task.subject_id) : false
            if @task
                render json: {
                    logged_in: true,
                    task_found: true,
                    task: @task,
                    subject: @subject,
                    subjects: @curr_user.subjects
                }
            else
                render json: {
                    logged_in: true,
                    task_found: false,
                    message: "No such task"
                }
            end
        else
            render json: {
                logged_in: false,
                message: "User not found"
            }
        end
    end

    def delete
        if logged_in? && curr_user
            # ensure that the task belongs to the user (has permission to delete)
            @tasks = @curr_user.tasks
            @task = @tasks.find(params[:task_id])
            if @task.destroy
                render json: {
                    deleted: true
                }
            else
                render json: {
                    deleted: false,
                    message: "Failed to delete task"
                }
            end
        else
            render json: {
                deleted: false,
                message: "Unauthorised user"
            }
        end
    end

    def update
        if logged_in? && curr_user
            @tasks = @curr_user.tasks
            @task = @tasks.find(params[:task_id])
            if @task.update(task_params)
                render json: {
                    updated: true
                }
            else
                render json: {
                    updated: false,
                    message: "failed to update task"
                }
            end
        else
            render json: {
                updated: false,
                message: "unauthorised user"
            }
        end
    end

    private
    def task_params
      params.require(:task).permit(:title, :description, :deadline, :subject_id, :priority, :completed, :user_id)
    end
end