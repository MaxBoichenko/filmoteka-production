

const spinner = document.querySelector('.spinner');
export function spinnerOff() {
   
  return setTimeout(() => {
    
    spinner.classList.add('spinner-visually-hidden');
  }, 600);
}

export async function spinnerOn() {
  
  spinner.classList.remove('spinner-visually-hidden');
}