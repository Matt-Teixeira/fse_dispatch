const [addLogEvent] = require("../utils/logger/log");
const {
  type: { I, W, E },
  tag: { cal, det, cat }
} = require("../utils/logger/enums");

const map_fse_fields = async (run_log, odata) => {
  try {
    await addLogEvent(I, run_log, "map_fse_fields", cal, null, null);
    const mapped_fields_list = [];

    for (let data of odata.value) {
      let mod_date = new Date(data.ServiceOrderCreated);
      data.ServiceOrderCreated = dateToExcelSerial(mod_date);

      let map = {
        Title: clean(data.ServiceOrderNbr),
        field_2: clean(data.EquipmentNbr),
        field_14: clean(data.Contact),
        field_15: clean(data.Description),
        field_16: clean(data.Status),
        field_17: clean(data.Description_2),
        field_18: clean(data.PartsCoverage),
        field_19: clean(data.StandardCoverageHours),
        field_20: clean(data.ExtendedServiceHours),
        field_21: clean(data.ExtendedPMHours),
        field_22: clean(data.OnSiteResponseTime),
        field_23: clean(data.PartsOrderRequirement),
        field_24: clean(data.Shipping),
        field_25: clean(data.AddressLine1),
        field_26: clean(data.AddressLine2),
        field_27: clean(data.City),
        field_28: clean(data.State),
        field_29: clean(data.PostalCode),
        field_30: clean(data.Manufacturer),
        field_31: clean(data.Modality),
        field_32: clean(data.Model),
        field_33: clean(data.AccountName),
        field_34: clean(data.ServiceOrderCreatedBy),
        field_36: clean(data.ServiceOrderCreated),
        field_44: clean(data.Phone1),
        DITerritory: clean(data.DITerritory),
        PrimaryEngineer: clean(data.PrimaryEngineer),
        SecondaryEngineer: clean(data.SecondaryEngineer),
        PrimaryFSEEmail: clean(data.PrimaryFSEEmail),
        SecondaryFSEEmail: clean(data.SecondaryFSEEmail),
        PrimaryFSEEmpStatus: clean(data.PrimaryFSEEmpStatus),
        SecondaryFSEEmpStatus: clean(data.SecondaryFSEEmpStatus),
        Notes: clean(data.Description_3)
      };

      mapped_fields_list.push(map);
    }

    await addLogEvent(
      I,
      run_log,
      "map_fse_fields",
      det,
      { mapped_fields_list },
      null
    );

    return mapped_fields_list;
  } catch (error) {
    await addLogEvent(E, run_log, "map_fse_fields", cat, null, error);
  }
};

const clean = (value) => {
  if (value == null) return null; // handles null and undefined
  if (typeof value === "string") return value.trim();
  return value; // leave numbers, dates, etc. alone
};

function dateToExcelSerial(date) {
  // Excel's "day 0" is 1899-12-30
  const excelEpoch = new Date(Date.UTC(1899, 11, 30)); // months are 0-based
  const diffMs = date.getTime() - excelEpoch.getTime();
  return diffMs / (1000 * 60 * 60 * 24); // days as float
}

function normalizeFieldsForSharePoint(raw) {
  const {
    LinkTitle, // already removed
    ...rest
  } = raw;

  const clean = { ...rest };

  // Normalize date/time field (adjust this if your date is in another format)
  if (clean.field_36) {
    // If already ISO-ish, Date can still parse it
    const d = new Date(clean.field_36);
    if (!isNaN(d.getTime())) {
      clean.field_36 = d.toISOString(); // e.g. "2025-12-09T17:31:02.403Z"
    } else {
      // fallback: if it's in "MM/DD/YYYY hh:mm:ss A" format, you'd need a custom parser
      // but from your example, you already have an ISO-like string
      console.warn("Could not parse field_36 date:", clean.field_36);
      clean.field_36 = null;
    }
  }

  if (clean.Notes) {
    clean.Notes = htmlToSingleLineText(clean.Notes);
  }
  return clean;
}

function htmlToSingleLineText(html) {
  return (
    html
      // remove style & script blocks
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")

      // remove all HTML tags
      .replace(/<[^>]+>/g, " ")

      // decode common HTML entities
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")

      // collapse whitespace into a single space
      .replace(/\s+/g, " ")

      .trim()
  );
}

module.exports = { map_fse_fields, normalizeFieldsForSharePoint };

const template_1 = {
  Title: null,
  field_4: null,
  field_7: null,
  field_8: null,
  field_9: null,
  field_10: null,
  field_11: null,
  field_12: null,
  field_13: null,
  field_14: null,
  field_15: null,
  field_16: null,
  field_17: null,
  field_18: null,
  field_19: null,
  field_20: null,
  field_21: null,
  field_22: null,
  field_23: null,
  field_24: null,
  field_25: null,
  field_26: null,
  field_27: null,
  field_28: null,
  field_29: null,
  field_31: null,
  field_33: null,
  field_35: null,
  field_36: null,
  field_37: null,
  field_38: null,
  field_39: null,
  field_40: null
};

/*
// Dev List Map
let map = {
  Title: clean(data.ServiceOrderNbr),
  field_4: clean(data.EquipmentNbr),
  field_7: clean(data.Contact),
  field_8: clean(data.Description),
  field_9: clean(data.Description_3),
  field_10: clean(data.Status),
  field_11: clean(data.Description_2),
  field_12: clean(data.PartsCoverage),
  field_13: clean(data.StandardCoverageHours),
  field_14: clean(data.ExtendedServiceHours),
  field_15: clean(data.ExtendedPMHours),
  field_16: clean(data.OnSiteResponseTime),
  field_17: clean(data.PartsOrderRequirement),
  field_18: clean(data.Shipping),
  field_19: clean(data.AddressLine1),
  field_20: clean(data.AddressLine2),
  field_21: clean(data.City),
  field_22: clean(data.State),
  field_23: clean(data.PostalCode),
  field_24: clean(data.Manufacturer),
  field_25: clean(data.Modality),
  field_26: clean(data.Model),
  field_27: clean(data.AccountName),
  field_28: clean(data.ServiceOrderCreatedBy),
  field_29: clean(data.ServiceOrderCreated),
  field_31: clean(data.Phone1),
  field_33: clean(data.DITerritory),
  field_35: clean(data.PrimaryFSEEmpStatus),
  field_36: clean(data.PrimaryEngineer),
  field_37: clean(data.SecondaryFSEEmpStatus),
  field_38: clean(data.SecondaryEngineer),
  field_39: clean(data.PrimaryFSEEmail),
  field_40: clean(data.SecondaryFSEEmail)
};

// Prod List Map
let map_2 = {
  Title: clean(data.ServiceOrderNbr),
  field_2: clean(data.EquipmentNbr),
  field_14: clean(data.Contact),
  field_15: clean(data.Description),
  field_16: clean(data.Status),
  field_17: clean(data.Description_2),
  field_18: clean(data.PartsCoverage),
  field_19: clean(data.StandardCoverageHours),
  field_20: clean(data.ExtendedServiceHours),
  field_21: clean(data.ExtendedPMHours),
  field_22: clean(data.OnSiteResponseTime),
  field_23: clean(data.PartsOrderRequirement),
  field_24: clean(data.Shipping),
  field_25: clean(data.AddressLine1),
  field_26: clean(data.AddressLine2),
  field_27: clean(data.City),
  field_28: clean(data.State),
  field_29: clean(data.PostalCode),
  field_30: clean(data.Manufacturer),
  field_31: clean(data.Modality),
  field_32: clean(data.Model),
  field_33: clean(data.AccountName),
  field_34: clean(data.ServiceOrderCreatedBy),
  field_36: clean(data.ServiceOrderCreated),
  field_44: clean(data.Phone1),
  DITerritory: clean(data.DITerritory),
  PrimaryEngineer: clean(data.PrimaryEngineer),
  SecondaryEngineer: clean(data.SecondaryEngineer),
  PrimaryFSEEmail: clean(data.PrimaryFSEEmail),
  SecondaryFSEEmail: clean(data.SecondaryFSEEmail),
  PrimaryFSEEmpStatus: clean(data.PrimaryFSEEmpStatus),
  SecondaryFSEEmpStatus: clean(data.SecondaryFSEEmpStatus),
  Notes: clean(data.Description_3)
};
*/
