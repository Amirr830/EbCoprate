

export function blob2File(res,fileName) {
    // ایجاد URL از داده‌های blob دریافت شده
    const url = window.URL.createObjectURL(new Blob([res.data]));
    // ایجاد لینک دانلود
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName); // نام فایل دانلودی
    document.body.appendChild(link);
    link.click();
    link.remove();

    // لغو Object URL برای آزادسازی حافظه
    window.URL.revokeObjectURL(url);
}