class AllowNullValueInTask < ActiveRecord::Migration[6.0]
  def change
    change_column :tasks, :subject_id, :bigint, null: true
    change_column :tasks, :description, :text, null: true
    change_column :tasks, :deadline, :datetime, null: true
  end
end
