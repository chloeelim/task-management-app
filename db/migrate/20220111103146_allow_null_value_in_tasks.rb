class AllowNullValueInTasks < ActiveRecord::Migration[6.0]
  def change
    change_column :tasks, :subject_id, :bigint, null: true
  end
end
