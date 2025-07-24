
'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { CourseForm } from "@/components/admin/CourseForm"
import type { ICourse } from "@/models/Course"

type CourseDialogProps = {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  course: ICourse | null
}

export function CourseDialog({ isOpen, onClose, onSave, course }: CourseDialogProps) {
  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{course ? "Edit Course" : "Add New Course"}</DialogTitle>
          <DialogDescription>
            {course ? "Update the details of the course." : "Fill in the details to create a new course."}
          </DialogDescription>
        </DialogHeader>
        <CourseForm course={course} onSave={onSave} />
      </DialogContent>
    </Dialog>
  )
}
