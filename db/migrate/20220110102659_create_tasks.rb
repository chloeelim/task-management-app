class CreateTasks < ActiveRecord::Migration[6.0]
  def change
    create_table :tasks do |t|
      t.string :title
      t.text :description
      t.datetime :deadline
      t.references :subject, null: true, foreign_key: true
      t.string :priority
      t.boolean :completed, null: false, default: false
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
