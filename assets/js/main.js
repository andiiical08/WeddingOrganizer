(function () {
  "use strict";
  var body = document.body,
    toast = document.querySelector(".toast");
  function notify(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(notify.timer);
    notify.timer = window.setTimeout(function () {
      toast.classList.remove("show");
    }, 2600);
  }
  var toggle = document.querySelector(".menu-toggle"),
    nav = document.querySelector(".nav-links");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation",
      );
    });
  }
  var services = document.querySelector(".nav-services > button"),
    serviceItem = document.querySelector(".nav-services");
  if (services && serviceItem) {
    services.addEventListener("click", function () {
      var open = serviceItem.classList.toggle("open");
      services.setAttribute("aria-expanded", String(open));
    });
  }
  document.querySelectorAll("[data-disabled-contact]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      notify("WhatsApp / Kontak Resmi Raessa Wedding Organizer.");
    });
  });
  document.querySelectorAll("[data-filter-group]").forEach(function (group) {
    var buttons = group.querySelectorAll("[data-filter]"),
      cards = document.querySelectorAll("[data-category]");
    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        buttons.forEach(function (b) {
          b.setAttribute("aria-pressed", "false");
        });
        button.setAttribute("aria-pressed", "true");
        var chosen = button.dataset.filter;
        cards.forEach(function (card) {
          card.hidden = chosen !== "all" && card.dataset.category !== chosen;
        });
      });
    });
  });
  var gallery = document.querySelector(".gallery"),
    lightbox = document.querySelector(".lightbox");
  if (gallery && lightbox) {
    var lbImg = lightbox.querySelector("img"),
      lbCaption = lightbox.querySelector(".lightbox-caption"),
      close = lightbox.querySelector(".lightbox-close"),
      items = Array.from(gallery.querySelectorAll(".gallery-item")),
      active = 0,
      previousFocus;
    function show(index) {
      active = (index + items.length) % items.length;
      var image = items[active].querySelector("img");
      lbImg.src = image.src;
      lbImg.alt = image.alt;
      lbCaption.textContent = items[active].dataset.caption || image.alt;
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
      body.style.overflow = "hidden";
      close.focus();
    }
    function dismiss() {
      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
      body.style.overflow = "";
      if (previousFocus) previousFocus.focus();
    }
    items.forEach(function (item, index) {
      item.addEventListener("click", function () {
        previousFocus = item;
        show(index);
      });
    });
    close.addEventListener("click", dismiss);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) dismiss();
    });
    lightbox
      .querySelector(".lightbox-prev")
      .addEventListener("click", function () {
        show(active - 1);
      });
    lightbox
      .querySelector(".lightbox-next")
      .addEventListener("click", function () {
        show(active + 1);
      });
    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") dismiss();
      if (e.key === "ArrowRight") show(active + 1);
      if (e.key === "ArrowLeft") show(active - 1);
      if (e.key === "Tab") {
        var focusable = Array.from(lightbox.querySelectorAll("button"));
        var first = focusable[0],
          last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }
  function copyText(text, successMessage) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(function () {
          notify(successMessage);
        })
        .catch(function () {
          fallbackCopy(text, successMessage);
        });
    } else {
      fallbackCopy(text, successMessage);
    }
  }
  function fallbackCopy(text, successMessage) {
    var field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    try {
      if (document.execCommand("copy")) notify(successMessage);
      else notify("Salin teks ringkasan secara manual.");
    } catch (error) {
      notify("Salin teks ringkasan secara manual.");
    }
    field.remove();
  }
  document.querySelectorAll("[data-copy]").forEach(function (button) {
    button.addEventListener("click", function () {
      var target = document.querySelector(button.dataset.copy);
      if (target) copyText(target.innerText, "Ringkasan disalin.");
    });
  });
  if (document.querySelector("[data-planner]")) initPlanner(notify);
  if (document.querySelector("[data-catering]")) initCatering();
  function initPlanner(notifyFn) {
    var form = document.querySelector("[data-planner]"),
      summary = document.querySelector("#planner-summary"),
      conceptButtons = document.querySelectorAll("[data-concept]"),
      chosenConcept = "Intimate Wedding";
    conceptButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        chosenConcept = btn.dataset.concept;
        conceptButtons.forEach(function (b) {
          b.setAttribute("aria-pressed", String(b === btn));
        });
        render();
      });
    });
    function field(name) {
      var el = form.elements[name];
      return el ? el.value.trim() : "";
    }
    function render() {
      if (!summary) return;
      var values = [
        ["Cakupan layanan", field("scope") || "Belum dipilih"],
        ["Konsep", chosenConcept],
        ["Anggaran", field("budget") || "Belum diisi"],
        [
          "Perkiraan tamu",
          field("guests")
            ? new Intl.NumberFormat("id-ID").format(Number(field("guests")))
            : "Belum diisi",
        ],
        ["Tanggal", field("date") || "Belum ditentukan"],
        ["Lokasi", field("location") || "Belum ditentukan"],
        ["Catatan", field("notes") || "—"],
      ];
      summary.innerHTML = values
        .map(function (v) {
          return (
            "<li><span>" +
            escapeHtml(v[0]) +
            "</span><strong>" +
            escapeHtml(v[1]) +
            "</strong></li>"
          );
        })
        .join("");
    }
    form.addEventListener("input", render);
    form.addEventListener("change", render);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      render();
      notifyFn("Pesan Anda telah Terkirim, Admin akan menghubungi Anda kurang dari 24 jam.");
    });
    render();
  }
  function initCatering() {
    var form = document.querySelector("[data-catering]"),
      data = window.RAESSA_CATERING_DATA,
      output = document.querySelector("#catering-summary"),
      quantity = form.elements.quantity,
      presets = document.querySelectorAll("[data-quantity]"),
      money = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      });
    presets.forEach(function (btn) {
      btn.addEventListener("click", function () {
        quantity.value = btn.dataset.quantity;
        presets.forEach(function (b) {
          b.setAttribute("aria-pressed", String(b === btn));
        });
        calculate();
      });
    });
    function calculate() {
      var amount = Number(quantity.value),
        pkg = data.packages[form.elements.menu.value] || data.packages.premium,
        valid =
          Number.isInteger(amount) &&
          amount >= data.minimumOrder &&
          amount <= 100000;
      document.querySelectorAll("[data-quantity]").forEach(function (b) {
        b.setAttribute(
          "aria-pressed",
          String(Number(b.dataset.quantity) === amount),
        );
      });
      if (!valid) {
        output.innerHTML =
          '<p class="form-error">Masukkan jumlah porsi bulat antara ' +
          data.minimumOrder +
          " dan 100.000.</p>";
        return;
      }
      var base = amount * pkg.pricePerPortion,
        unknown = Object.keys(pkg.extras).filter(function (key) {
          return pkg.extras[key] === null;
        });
      var date = form.elements.date.value || "Belum ditentukan",
        location = form.elements.location.value.trim() || "Belum ditentukan",
        notes = form.elements.notes.value.trim() || "—";
      output.innerHTML =
        '<div class="cost-row"><span>' +
        escapeHtml(pkg.label) +
        " · " +
        new Intl.NumberFormat("id-ID").format(amount) +
        " porsi</span><strong>" +
        money.format(base) +
        '</strong></div><p class="small">Termasuk: ' +
        escapeHtml(pkg.included.join(", ")) +
        '</p><div class="cost-row"><span>Peralatan buffet</span><span class="cost-status">Belum dikonfirmasi</span></div><div class="cost-row"><span>Staf layanan</span><span class="cost-status">Belum dikonfirmasi</span></div><div class="cost-row"><span>Pengiriman & setup</span><span class="cost-status">Belum dikonfirmasi</span></div><div class="cost-row"><span>Pajak / biaya layanan</span><span class="cost-status">Belum dikonfirmasi</span></div><p class="price-total">' +
        money.format(base) +
        '</p><p class="small">Nilai dasar simulasi saja. Total lengkap belum tersedia; ' +
        unknown.length +
        " komponen biaya masih belum diketahui.</p><p><strong>Ringkasan:</strong><br>" +
        escapeHtml(pkg.label) +
        " · " +
        escapeHtml(data.services[form.elements.service.value]) +
        " · " +
        new Intl.NumberFormat("id-ID").format(amount) +
        " porsi<br>Tanggal: " +
        escapeHtml(date) +
        " · Lokasi: " +
        escapeHtml(location) +
        "<br>Catatan: " +
        escapeHtml(notes) +
        "</p>";
    }
    form.addEventListener("input", calculate);
    form.addEventListener("change", calculate);
    form.addEventListener("reset", function () {
      window.setTimeout(function () {
        calculate();
      }, 0);
    });
    document
      .querySelector("[data-catering-copy]")
      .addEventListener("click", function () {
        copyText(output.innerText, "Ringkasan simulasi disalin.");
      });
    calculate();
  }
  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[char];
    });
  }
})();
