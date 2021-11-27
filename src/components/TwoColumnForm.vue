
<template>
  <div class="text-sm" :class="{ 'border-t': !noBorder }">
    <template v-for="df in formFields">
      <FormControl
        :key="df.fieldname"
        v-if="df.fieldtype === 'Table'"
        ref="controls"
        size="small"
        :df="df"
        :value="doc[df.fieldname]"
        :read-only="submitted"
        @change="(value) => onChange(df, value)"
      />
      <template v-else>
        <template v-if="inlineEditField === df && inlineEditDoc">
          <div class="border-b" :key="df.fieldname">
            <TwoColumnForm
              ref="inlineEditForm"
              :doc="inlineEditDoc"
              :fields="inlineEditFields"
              :column-ratio="columnRatio"
              :no-border="true"
              :focus-first-input="true"
              @error="(msg) => $emit('error', msg)"
            />
            <div class="flex px-4 pb-2">
              <Button
                class="w-1/2 text-gray-900"
                @click="inlineEditField = null"
              >
                {{ _('Cancel') }}
              </Button>
              <Button
                type="primary"
                class="ml-2 w-1/2 text-white"
                @click="saveInlineEditDoc"
              >
                {{ df.inlineSaveText || _('Save') }}
              </Button>
            </div>
          </div>
        </template>
        <div
          :key="df.fieldname"
          v-else
          class="grid"
          :class="{ 'border-b': !noBorder }"
          :style="style"
        >
          <div class="py-2 pl-4 flex text-gray-600">
            <div class="py-1">
              {{ df.label }}
            </div>
          </div>
          <div
            class="py-2 pr-4"
            @click="activateInlineEditing(df)"
            :class="{
              'pl-2': df.fieldtype === 'AttachImage',
            }"
          >
            <FormControl
              ref="controls"
              size="small"
              :df="df"
              :value="
                df.inline && doc.getLink(df.fieldname)
                  ? doc.getLink(df.fieldname)[
                      doc.getLink(df.fieldname).meta.inlineEditDisplayField ||
                        'name'
                    ]
                  : doc[df.fieldname]
              "
              :class="{ 'p-2': df.fieldtype === 'Check' }"
              :read-only="submitted"
              @change="(value) => onChange(df, value)"
              @focus="activateInlineEditing(df)"
              @new-doc="(newdoc) => onChange(df, newdoc.name)"
            />
            <div
              class="text-sm text-red-600 mt-2 pl-2"
              v-if="errors[df.fieldname]"
            >
              {{ errors[df.fieldname] }}
            </div>
          </div>
        </div>
      </template>
    </template>
    <div class="flex items-center justify-between px-4 pt-4">
      <div class="flex items-center"></div>
      <div class="flex items-stretch">
        <Button
          :icon="true"
          @click="onChangeButton"
          type="primary"
          v-if="doc"
          ref="controls"
          :read-only="submitted"
          class="ml-2 text-white text-xs"
        >
          {{ doc._notInserted ? _('Crear') : _('Guardar Cambios') }}
        </Button>
      </div>
    </div>
  </div>
</template>
<script>
import frappe from 'frappejs';
import FormControl from '@/components/Controls/FormControl';
import Button from '@/components/Button';
import { getErrorMessage, handleErrorWithDialog } from '@/utils';

let TwoColumnForm = {
  name: 'TwoColumnForm',
  props: {
    doc: Object,
    fields: Array,
    autosave: Boolean,
    columnRatio: {
      type: Array,
      default: () => [1, 1],
    },
    noBorder: Boolean,
    focusFirstInput: Boolean,
  },
  data() {
    return {
      inlineEditField: null,
      inlineEditDoc: null,
      inlineEditFields: null,
      inlineEditDisplayField: null,
      errors: {},
    };
  },
  provide() {
    return {
      doctype: this.doc.doctype,
      name: this.doc.name,
      doc: this.doc,
      newName: '',
    };
  },
  components: {
    FormControl,
    Button,
    TwoColumnForm: () => TwoColumnForm,
  },
  mounted() {
    if (this.focusFirstInput) {
      this.$refs['controls'][0].focus();
    }
  },
  methods: {
    async onChangeButton() {
      if (this.doc._notInserted) {
        this.$refs.form.insert();
        return;
      } else {
        console.log(this.doc)
        await this.doc.update();
        await this.doc.rename(this.newName);
        console.log('asdfdsafafsdfads')
      }
/*
      if (this.doc._dirty && !this.doc.isNew()) {
      }

      // handle rename
      if (!this.doc.isNew() && this.newName != this.doc.get('name')) {
      }*/
    },
    onChange(df, value) {
      const isfalse = false;

      if (value == null) {
        return;
      }

      let oldValue = this.doc.get(df.fieldname);

      if (oldValue === value) {
        return;
      }

      // handle rename
      if (df.fieldname === 'name' && !this.doc.isNew()) {
        this.newName = value;
        return;
        //return this.doc.rename(value);
      }

      // reset error messages
      this.$set(this.errors, df.fieldname, null);

      this.doc.set(df.fieldname, value).catch((e) => {
        // set error message for this field
        this.$set(this.errors, df.fieldname, getErrorMessage(e, this.doc));
      });

      if (isfalse && this.doc._dirty && !this.doc.isNew()) {
        if (df.fieldtype === 'Table') {
          return;
        }
        //this.doc.update();
      }
    },
    insertOrUpdate() {
      return this.doc.insertOrUpdate().catch(this.handleError);
    },
    insert() {
      return this.doc.insert().catch(this.handleError);
    },
    submit() {
      return this.doc.submit().catch(this.handleError);
    },
    handleError(e) {
      handleErrorWithDialog(e, this.doc);
    },
    async activateInlineEditing(df) {
      if (df.inline) {
        this.inlineEditField = df;
        if (!this.doc[df.fieldname]) {
          this.inlineEditDoc = await frappe.getNewDoc(df.target);
          this.inlineEditDoc.once('afterInsert', () => {
            this.onChange(df, this.inlineEditDoc.name);
          });
        } else {
          this.inlineEditDoc = this.doc.getLink(df.fieldname);
        }
        this.inlineEditDisplayField =
          this.doc.meta.inlineEditDisplayField || 'name';
        this.inlineEditFields = frappe.getMeta(df.target).getQuickEditFields();
      }
    },
    async saveInlineEditDoc() {
      if (this.inlineEditDoc) {
        await this.$refs.inlineEditForm[0].insertOrUpdate();
        await this.doc.loadLinks();
        this.inlineEditField = null;
      }
    },
  },
  computed: {
    formFields() {
      return this.fields || this.doc.meta.getQuickEditFields();
    },
    style() {
      let templateColumns = (this.columnRatio || [1, 1])
        .map((r) => `${r}fr`)
        .join(' ');
      return {
        'grid-template-columns': templateColumns,
      };
    },
    submitted() {
      return Boolean(this.doc.meta.isSubmittable && this.doc.submitted);
    },
  },
};

export default TwoColumnForm;
</script>
