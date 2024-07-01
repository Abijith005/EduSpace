import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-teacher-payment',
  templateUrl: './teacher-payment.component.html',
  styleUrls: ['./teacher-payment.component.css']
})
export class TeacherPaymentComponent implements OnInit {
  categoryForm!: FormGroup;
  role: string = '';
  permissions: any[] = [
    {
      _id: "666c4c9a84ed026ce2007fdb",
      name: "CreateRecord",
      component: "CreateRecord",
      parentId: null,
      label: "CreateRecord",
      submenu: [
        {
          _id: "667e8e5506b1ae1a6b1767ec",
          name: "Submenu1",
          component: "Submenu1",
          parentId: "666c4c9a84ed026ce2007fdb",
          label: "CreateRecord"
        },
        {
          _id: "667e8eba06b1ae1a6b1767ee",
          name: "Submenu2",
          component: "Submenu2",
          parentId: "666c4c9a84ed026ce2007fdb",
          label: "submenu2"
        }
      ]
    },
    {
      _id: "667e8ece06b1ae1a6b1767ef",
      name: "Mainmenu1",
      component: "Mainmenu",
      parentId: null,
      label: "mainmenu",
      submenu: [
        {
          _id: "667e8f2c06b1ae1a6b1767f1",
          name: "Submenu1",
          component: "Submenu1",
          parentId: "667e8ece06b1ae1a6b1767ef",
          label: "CreateRecord"
        }
      ]
    }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      userType: ['', Validators.required],
      description: ['', Validators.required],
      categories: this.fb.array(this.permissions.map(category => this.createCategoryGroup(category)))
    });
  }

  createCategoryGroup(category: any): FormGroup {
    return this.fb.group({
      _id: [category._id],
      name: [category.name],
      component: [category.component],
      submenu: this.fb.array(category.submenu.map((submenu: any) => this.createSubmenuGroup(submenu)))
    });
  }

  createSubmenuGroup(submenu: any): FormGroup {
    return this.fb.group({
      _id: [submenu._id],
      name: [submenu.name],
      component: [submenu.component],
      add: [false],
      edit: [false],
      delete: [false]
    });
  }

  get categories(): FormArray {
    return this.categoryForm.get('categories') as FormArray;
  }

  getCategory(i: number): FormGroup {
    return this.categories.at(i) as FormGroup;
  }

  getSubmenu(categoryIndex: number): FormArray {
    return this.getCategory(categoryIndex).get('submenu') as FormArray;
  }

  getSubmenuGroup(categoryIndex: number, submenuIndex: number): FormGroup {
    return this.getSubmenu(categoryIndex).at(submenuIndex) as FormGroup;
  }

  transformFormValue(formValue: any) {
    const result: any = [];
    formValue.categories.forEach((category: any) => {
      category.submenu.forEach((submenu: any) => {
        result.push({
          menuId: submenu._id,
          add: submenu.add,
          edit: submenu.edit,
          delete: submenu.delete
        });
      });
    });
    return result;
  }

  onSubmit() {
    const transformedValue = this.transformFormValue(this.categoryForm.value);
    console.log('Transformed Value:', transformedValue);
    console.log('Role:', this.role);

    const { name, userType, description } = this.categoryForm.value;
    console.log('Name:', name);
    console.log('User Type:', userType);
    console.log('Description:', description);
  }
}
