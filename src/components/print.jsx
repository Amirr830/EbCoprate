export default function PrintContent(printRef, afterEnd) {
  const content = printRef.current;
  const printWindow = window.open('', '', 'height=500,width=700');
    // اضافه کردن استایل‌های صفحه به پنجره چاپ
  const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]')).map(style => style.outerHTML).join('');

  printWindow.document.write('<html ><head><title>Print</title>');
  printWindow.document.write(styles); // استایل‌ها را به صفحه چاپ اضافه می‌کنیم
  printWindow.document.write('</head><body dir="rtl">');
  printWindow.document.write(content?.innerHTML);
  printWindow.document.write('</body></html>');

  console.log(printWindow.document)
  // اطمینان از بارگذاری کامل قبل از چاپ
  setTimeout(() => {
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
    afterEnd()
  }, 500); // تاخیر 500 میلی‌ثانیه قبل از چاپ
};

